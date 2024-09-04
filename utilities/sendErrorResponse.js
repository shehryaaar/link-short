import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration.js';

import sendResponse from '@/utilities/sendResponse.js';
import getEnvironmentByName from '@/utilities/getEnvironmentByName.js';

const sendErrorResponse = async (request, error) => {
    return await sendResponse(
        request,
        false,
        httpStatus.INTERNAL_SERVER_ERROR,
        configuration.env !== getEnvironmentByName('PRODUCTION')
            ? error.message
            : 'Internal Server Error.'
    );
};

export default sendErrorResponse;
