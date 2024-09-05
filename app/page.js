'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { createData, getData } from '@/utilities/axios.js';
import Spinner from '@/components/spinner/Spinner';
import { RiEmotionHappyFill } from 'react-icons/ri';
import { FaGithub, FaLink } from 'react-icons/fa';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
} from '@nextui-org/react';

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
        <div className="w-full h-[100vh] flex flex-col gap-6 pt-10 max-w-7xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-2">
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

            <div className="flex items-center justify-between px-4 md:px-2">
                <form
                    onSubmit={handleUrlShortClick}
                    className="flex items-center gap-4"
                >
                    <Input
                        className="w-[570px]"
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

            <Table
                isStriped
                isHeaderSticky
                aria-label="Example table with client side sorting"
                className={
                    'flex flex-grow table-auto h-full w-full overflow-y-auto'
                }
            >
                <TableHeader>
                    <TableColumn>Created At</TableColumn>
                    <TableColumn>Short URL</TableColumn>
                    <TableColumn>Original URL</TableColumn>
                </TableHeader>
                <TableBody>
                    {urls &&
                        urls?.map((url) => (
                            <TableRow key={url?._id}>
                                <TableCell>{url?.createdAt}</TableCell>
                                <TableCell>
                                    <a
                                        href={`${currentDeploymentUrl}/${url?.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {currentDeploymentUrl}/{url?.id}
                                    </a>
                                </TableCell>
                                <TableCell>{url?.url}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
