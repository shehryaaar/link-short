'use client';

import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { createData, getData } from '@/utilities/axios.js';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { GoInfo } from 'react-icons/go';
import Spinner from '@/components/spinner/Spinner';

export default function Home() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const fetchApiData = async () => {
        try {
            setLoading(true);

            const data = await getData('/api/v1');

            setUrls(data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiData();
    }, []);

    const handleUrlShortClick = async (event) => {
        event.preventDefault();

        if (!urlInput) {
            toast.error('Please enter a URL.');
            return;
        }

        const createDefaultPromise = createData(`/api/v1`, { url: urlInput });

        toast.promise(createDefaultPromise, {
            loading: 'Shortening...',
            success: (result) => {
                if (result.success) {
                    fetchApiData();
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            },
            error: 'An error occurred while shortening the URL.',
        });

        try {
            await createDefaultPromise;
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return loading ? (
        <Spinner />
    ) : (
        <div className="flex flex-col gap-4 m-20">
            <form
                onSubmit={handleUrlShortClick}
                className="flex items-center gap-4"
            >
                <Input
                    className="max-w-[400px]"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter URL here"
                />
                <Button type="submit" variant="outline">
                    Shorten URL
                </Button>
            </form>

            <Table>
                <TableCaption>A list recent URLs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Created At</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {urls &&
                        urls.map((url, index) => (
                            <TableRow key={url?._id}>
                                <TableCell className="font-medium">
                                    {url.createdAt}
                                </TableCell>
                                <TableCell>
                                    <Badge>{url?.id}</Badge>
                                </TableCell>
                                <TableCell>{url?.url}</TableCell>
                                <TableCell className="flex justify-end">
                                    <GoInfo className="text-black text-lg" />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
