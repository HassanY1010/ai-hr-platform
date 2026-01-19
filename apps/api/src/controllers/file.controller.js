import path from 'path';

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('Please upload a file');
            error.statusCode = 400;
            throw error;
        }

        // Fix UTF-8 encoding for Arabic/non-ASCII filenames
        // Multer receives filenames as Latin1, need to convert to UTF-8
        let decodedFilename = req.file.originalname;
        try {
            // Convert from Latin1 to UTF-8
            decodedFilename = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        } catch (encodingError) {
            console.warn('Filename encoding conversion failed, using original:', encodingError);
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        // Extract relative path after 'uploads' directory, handling both Windows/Unix paths safely
        // We use split with regex to ignore case and handle both slash types if needed, though they are usually OS specific
        // path.sep could be used but split is simpler for URL generation here.
        const pathParts = req.file.path.split(/[\\/]uploads[\\/]/i);
        const relativePath = pathParts.length > 1 ? pathParts.pop().replace(/\\/g, '/') : '/' + req.file.filename;

        const fileUrl = `${baseUrl}/uploads/${relativePath.replace(/^\//, '')}`;

        res.status(200).json({
            status: 'success',
            data: {
                name: decodedFilename,
                url: fileUrl,
                key: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteFile = async (req, res, next) => {
    // Basic implementation for now
    res.status(200).json({ status: 'success', message: 'File deletion logic would go here' });
};
