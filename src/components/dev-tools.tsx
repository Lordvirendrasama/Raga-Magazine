"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  limit,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDropzone } from "react-dropzone";
import {
  Copy,
  Trash2,
  UploadCloud,
  FileJson,
  Edit,
  Send,
  Plus,
  RefreshCw,
  Sparkles,
  Wand2,
  ChevronsRight,
  Clipboard,
  Link,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { generateArticle } from "@/ai/flows/generate-article-flow";
import { Skeleton } from "./ui/skeleton";

const db = getFirestore(app);
const storage = getStorage(app);

// Firestore Explorer
const FirestoreExplorer = () => {
  const [collectionName, setCollectionName] = useState("articles");
  const [documents, setDocuments] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    if (!collectionName) {
      setError("Please enter a collection name.");
      setDocuments([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, collectionName), limit(25));
      const snapshot = await getDocs(q);
      const docsData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (docsData.length > 0) {
        const keys = Object.keys(docsData[0]);
        const generatedColumns: ColumnDef<any>[] = keys
          .slice(0, 5)
          .map((key) => ({
            accessorKey: key,
            header: key,
          }));
        generatedColumns.push({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log("Edit", row.original.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
        });
        setColumns(generatedColumns);
      } else {
        setColumns([]);
      }
      setDocuments(docsData);
    } catch (e: any) {
      setError(`Failed to fetch documents: ${e.message}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    if (
      !collectionName ||
      !window.confirm(`Are you sure you want to delete document ${id}?`)
    )
      return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Success", description: `Document ${id} deleted.` });
      fetchDocuments();
    } catch (e: any) {
      toast({
        title: "Error",
        description: `Failed to delete document: ${e.message}`,
        variant: "destructive",
      });
    }
  };

  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const exportToJson = () => {
    const dataStr = JSON.stringify(documents, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${collectionName}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firestore Data Explorer</CardTitle>
        <CardDescription>
          Browse and manage your Firestore collections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Enter collection name (e.g., articles)"
          />
          <Button onClick={fetchDocuments} disabled={loading}>
            {loading ? "Loading..." : "Query"}
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <div className="rounded-md border">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          onClick={exportToJson}
          disabled={documents.length === 0}
        >
          <FileJson className="mr-2 h-4 w-4" />
          Export to JSON
        </Button>
      </CardFooter>
    </Card>
  );
};

// Storage Manager
const StorageManager = () => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    try {
      const listRef = ref(storage);
      const res = await listAll(listRef);
      const fileList = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        })
      );
      setFiles(fileList);
    } catch (e: any) {
      toast({
        title: "Error",
        description: `Could not list files: ${e.message}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(prog);
        },
        (error) => {
          setUploading(false);
          toast({
            title: "Upload Failed",
            description: error.message,
            variant: "destructive",
          });
        },
        () => {
          setUploading(false);
          toast({ title: "Success", description: "File uploaded." });
          fetchFiles();
        }
      );
    },
    [toast, fetchFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = async (fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`))
      return;
    const fileRef = ref(storage, fileName);
    try {
      await deleteObject(fileRef);
      toast({ title: "Success", description: "File deleted." });
      fetchFiles();
    } catch (e: any) {
      toast({
        title: "Error",
        description: `Could not delete file: ${e.message}`,
        variant: "destructive",
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "File URL copied to clipboard." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Storage Manager</CardTitle>
        <CardDescription>
          Upload and manage your test assets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed ${
            isDragActive ? "border-primary" : "border-input"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
          <p>
            {isDragActive
              ? "Drop the files here ..."
              : "Drag 'n' drop some files here, or click to select files"}
          </p>
        </div>
        {uploading && (
          <div className="mt-4">
            <progress value={progress} max="100" className="w-full" />
          </div>
        )}
        <h3 className="my-4 font-bold">Uploaded Files</h3>
        <ScrollArea className="h-72">
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <span className="truncate pr-4">{file.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyUrl(file.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(file.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// API Tester
const ApiTester = () => {
  const [endpoint, setEndpoint] = useState("/api/getArtist");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState('{\n  "artistId": "some-id"\n}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (method === "POST" || method === "PUT") {
        options.body = body;
      }
      const res = await fetch(endpoint, options);
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (e: any) {
      setResponse({ status: 500, data: { error: e.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Request Tester</CardTitle>
        <CardDescription>
          Test your Firebase Cloud Function endpoints directly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="e.g., /api/getArtist"
          />
          <Button onClick={handleRequest} disabled={loading}>
            <Send className="mr-2 h-4 w-4" />
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
        {(method === "POST" || method === "PUT") && (
          <div>
            <Label htmlFor="body">Request Body (JSON)</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="h-32 font-mono"
            />
          </div>
        )}
        {response && (
          <div>
            <Label>Response</Label>
            <div className="rounded-md border bg-muted p-4">
              <p>Status: {response.status}</p>
              <ScrollArea className="h-48">
                <pre className="text-sm">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Realtime Logs
const RealtimeLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "logs"),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLogs(logsData);
    });

    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter(
    (log) => !filter || log.tag?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime Logs</CardTitle>
        <CardDescription>
          Live feed from your 'logs' Firestore collection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by tag (e.g., API, Deploy)"
          className="mb-4"
        />
        <ScrollArea className="h-96 rounded-md border p-4 font-mono text-sm">
          {filteredLogs.map((log) => (
            <div key={log.id} className="mb-2 border-b pb-2">
              <span className="text-primary">
                [{new Date(log.timestamp?.toDate()).toLocaleString()}]
              </span>
              <span
                className={`mx-2 font-bold ${
                  log.level === "error" ? "text-destructive" : "text-accent"
                }`}
              >
                [{log.tag?.toUpperCase() || "GENERAL"}]
              </span>
              <span>{log.message}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// AI Console
const AiConsole = () => {
  const [topic, setTopic] = useState("A new indie artist from Mumbai");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const result = await generateArticle({ topic });
      setResponse(result);
      toast({
        title: "Article Generated",
        description: "AI-powered article has been created.",
      });
    } catch (e: any) {
      toast({
        title: "Generation Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Prompt Console</CardTitle>
        <CardDescription>
          Generate draft articles using AI. Enter a topic to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ai-prompt">Article Topic</Label>
          <Textarea
            id="ai-prompt"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The rise of folk-fusion in South India"
            className="h-24"
          />
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Article
        </Button>
        {loading && (
           <div className="space-y-2">
             <Skeleton className="h-4 w-1/4" />
             <Skeleton className="h-20 w-full" />
           </div>
        )}
        {response && (
          <div>
            <Label>Generated Content</Label>
            <div className="mt-2 space-y-4 rounded-md border bg-muted p-4">
              <h3 className="font-bold text-lg">{response.title}</h3>
              <ScrollArea className="h-60">
                <p className="text-sm whitespace-pre-wrap">{response.body}</p>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Cache Manager
const CacheManager = () => {
  const [path, setPath] = useState("/posts/some-article-slug");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRevalidate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/revalidate?path=${path}`);
      if (!res.ok) throw new Error("Failed to revalidate.");
      const result = await res.json();
      if (result.revalidated) {
        toast({
          title: "Success",
          description: `Path ${path} has been revalidated.`,
        });
      } else {
        throw new Error(`Revalidation failed for ${path}.`);
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache & CDN Panel</CardTitle>
        <CardDescription>
          Manually revalidate pages to show the latest content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="revalidate-path">Path to Revalidate</Label>
          <div className="flex gap-2">
            <Input
              id="revalidate-path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/posts/your-article-slug"
            />
            <Button onClick={handleRevalidate} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {loading ? "Revalidating..." : "Revalidate"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use this to force-update a page after making changes in your CMS.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Utility Belt
const UtilityBelt = () => {
  const [base64Input, setBase64Input] = useState("hello world");
  const [base64Output, setBase64Output] = useState("");
  const [slugInput, setSlugInput] = useState("This is a Test Title!");
  const [slugOutput, setSlugOutput] = useState("");
  const { toast } = useToast();

  const handleEncode = () => setBase64Output(btoa(base64Input));
  const handleDecode = () => {
    try {
      setBase64Output(atob(base64Input));
    } catch (e) {
      toast({
        title: "Invalid Base64",
        variant: "destructive",
      });
    }
  };

  const handleSlugify = () => {
    const slug = slugInput
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlugOutput(slug);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utility Belt</CardTitle>
        <CardDescription>A collection of handy dev tools.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base64 Converter */}
        <div>
          <Label className="font-semibold">Base64 Converter</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Text to convert"
            />
            <Button onClick={handleEncode}>Encode</Button>
            <Button onClick={handleDecode} variant="secondary">
              Decode
            </Button>
          </div>
          {base64Output && (
            <div className="mt-2 flex items-center gap-2 rounded-md border bg-muted p-2">
              <p className="truncate text-sm flex-1">{base64Output}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(base64Output)}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {/* Slugify Tool */}
        <div>
          <Label className="font-semibold">Slugify Tool</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              placeholder="Enter a title"
            />
            <Button onClick={handleSlugify}>
              <Link className="h-4 w-4 mr-2" /> Slugify
            </Button>
          </div>
          {slugOutput && (
            <div className="mt-2 flex items-center gap-2 rounded-md border bg-muted p-2">
              <p className="truncate text-sm flex-1">{slugOutput}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(slugOutput)}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


export function DevTools() {
  const [activeTab, setActiveTab] = useState("firestore");
  
  return (
    <Tabs defaultValue="firestore" className="w-full" onValueChange={setActiveTab}>
      <ScrollArea className="w-full whitespace-nowrap">
        <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-7">
            <TabsTrigger value="firestore">Firestore</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="api">API Tester</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="ai-console">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Console
            </TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="utils">
              <Wand2 className="mr-2 h-4 w-4" />
              Utilities
            </TabsTrigger>
        </TabsList>
      </ScrollArea>
      <TabsContent value="firestore">
        <FirestoreExplorer />
      </TabsContent>
      <TabsContent value="storage">
        <StorageManager />
      </TabsContent>
      <TabsContent value="api">
        <ApiTester />
      </TabsContent>
      <TabsContent value="logs">
        <RealtimeLogs />
      </TabsContent>
      <TabsContent value="ai-console">
        <AiConsole />
      </TabsContent>
      <TabsContent value="cache">
        <CacheManager />
      </TabsContent>
       <TabsContent value="utils">
        <UtilityBelt />
      </TabsContent>
    </Tabs>
  );
}
