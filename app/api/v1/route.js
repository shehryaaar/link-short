import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

import UrlsModel from '@/app/api/v1/urls/urls.model.js';
import databaseService from '@/service/databaseService.js';
import httpStatus from '@/constants/httpStatus.constants.js';

import sendErrorResponse from '@/utilities/sendErrorResponse.js';
import sendResponse from '@/utilities/sendResponse.js';

export const POST = async (request) => {
    console.debug('Starting URL shortening process');

    try {
        await databaseService.connect(); // Connect to the database service

        let shortId = uuidv4().slice(0, 6); // Generate a 6-character short ID
        console.debug(`Generated URL code: ${shortId}`);

        // Ensure the shortId is unique
        let unique = false;
        while (!unique) {
            const exists = await UrlsModel.exists({ id: shortId });
            if (!exists) {
                unique = true;
            } else {
                shortId = uuidv4().slice(0, 6); // Generate a new short ID if collision
                console.debug(`Generated new URL code: ${shortId}`);
            }
        }

        const urlData = await request.json(); // Get the original URL from the request
        console.debug(`Received URL data: ${urlData}`);

        // Validate URL using validator library
        if (!validator.isURL(urlData.url)) {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'Invalid URL format.'
            );
        }

        // Create a new URL entry in the database
        const newUrl = await UrlsModel.create({
            url: urlData.url,
            id: shortId,
        });

        return await sendResponse(
            request,
            true,
            httpStatus.CREATED,
            'URL shortened successfully.',
            newUrl
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};

export const GET = async (request) => {
    console.debug('Starting URL shortening process');

    try {
        await databaseService.connect();

        const urls = await UrlsModel.find().sort({ createdAt: -1 });

        if (urls.length === 0) {
            return await sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No URLs found in the database.'
            );
        }

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            `${urls?.length} original URLs found successfully.`,
            urls
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
