import UrlsModel from '@/app/api/v1/urls/urls.model.js';
import databaseService from '@/service/databaseService.js';
import httpStatus from '@/constants/httpStatus.constants.js';

import sendErrorResponse from '@/utilities/sendErrorResponse.js';
import sendResponse from '@/utilities/sendResponse.js';

export const GET = async (request, context) => {
    console.debug('Starting URL shortening process');

    try {
        await databaseService.connect(); // Connect to the database service

        const { params } = context;
        const shortId = params.shortId;
        console.debug(
            `Received shortId: ${shortId} from the request parameters`
        );

        const newUrl = await UrlsModel.findOne({
            id: shortId,
        });

        if (!newUrl) {
            return await sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'URL not found.'
            );
        }

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'Original URL found successfully.',
            newUrl
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
