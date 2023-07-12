import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

const s3Client = new S3Client({
    endpoint: 'https://' + process.env.DIGITAL_OCEAN_ENDPOINT,
    region: 'sfo.3',
    credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SECRET_SPACES,
    },
});

export const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.BUCKET,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});
