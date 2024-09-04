'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { createData, getData } from '@/utilities/axios.js';
import Spinner from '@/components/spinner/Spinner';
import { RiEmotionHappyFill } from 'react-icons/ri';
import { FaGithub, FaLink } from 'react-icons/fa';
import configuration from '@/configuration/configuration';

export default function Home() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [currentDeploymentUrl, setCurrentDeploymentUrl] = useState('');

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

    useEffect(() => {
        const url = `${window.location.protocol}//${window.location.host}`;
        setCurrentDeploymentUrl(url);
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
        <div className="flex flex-col gap-12 mx-28 my-16">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FaLink />
                    <span className="text-lg">URL SHORTENER</span>
                </div>

                <a
                    className="flex items-center gap-2"
                    href="https://github.com/montasim/url-shortener"
                    target="_blank"
                    referrerPolicy="no-referrer"
                >
                    <FaGithub className="text-lg" />
                    <span>View on GitHub</span>
                </a>
            </div>

            <div className="flex items-center justify-between">
                <form
                    onSubmit={handleUrlShortClick}
                    className="flex items-center gap-4"
                >
                    <Input
                        className="w-[650px]"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Enter URL here"
                    />
                    <Button type="submit" variant="outline">
                        Shorten URL
                    </Button>
                </form>

                <div className="flex items-center gap-2">
                    <RiEmotionHappyFill className="text-lg" />
                    <span>{urls?.length}</span>
                </div>
            </div>

            <Table>
                <TableCaption>A list of recent URLs</TableCaption>

                <TableHeader className="sticky top-0">
                    <TableRow>
                        <TableHead className="w-[250px]">Created At</TableHead>
                        <TableHead>Short URL</TableHead>
                        <TableHead>Original URL</TableHead>
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
                                    {currentDeploymentUrl}/{url?.id}
                                </TableCell>
                                <TableCell>{url?.url}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
