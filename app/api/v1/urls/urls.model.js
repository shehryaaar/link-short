import { Schema, model, models } from 'mongoose';

// Define constants if not already defined
const constants = {
    url: {
        MAX_LENGTH: 2048,
    },
    shortId: {
        LENGTH: 6,
    },
    defaultExpiration: '1y',
};

const urlsSchema = new Schema(
    {
        url: {
            type: String,
            trim: true,
            required: [true, 'Original URL is required.'],
            minlength: [1, 'Original URL cannot be empty.'],
            maxlength: [
                constants.url.MAX_LENGTH,
                `Original URL should not exceed ${constants.url.MAX_LENGTH} characters.`,
            ],
            description: 'The original URL that needs to be shortened.',
        },
        id: {
            type: String,
            trim: true,
            required: [true, 'Short ID is required.'],
            minlength: [
                constants.shortId.LENGTH,
                `Short ID should be exactly ${constants.shortId.LENGTH} characters.`,
            ],
            maxlength: [
                constants.shortId.LENGTH,
                `Short ID should be exactly ${constants.shortId.LENGTH} characters.`,
            ],
            unique: true,
            description: 'The shortened URL identifier.',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            description: 'The date and time when the URL was created.',
        },
        expiration: {
            type: Date,
            description: 'The date and time when the URL was last updated.',
        },
    },
    {
        timestamps: { createdAt: 'createdAt' },
        versionKey: false,
        description:
            'Schema for storing original URLs and their shortened versions with timestamps.',
    }
);

const UrlsModel = models.Urls || model('Urls', urlsSchema);

export default UrlsModel;
