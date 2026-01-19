import fs from 'fs';
import https from 'https';
import path from 'path';

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const modelsDir = path.join(process.cwd(), 'public', 'models');

const files = [
    'ssd_mobilenetv1_model-weights_manifest.json',
    'ssd_mobilenetv1_model-shard1',
    'ssd_mobilenetv1_model-shard2',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_recognition_model-shard2'
];

if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const downloadFile = (file) => {
    const url = `${baseUrl}/${file}`;
    const dest = path.join(modelsDir, file);

    if (fs.existsSync(dest)) {
        console.log(`Skiiping ${file} (already exists)`);
        return;
    }

    const fileStream = fs.createWriteStream(dest);

    console.log(`Downloading ${file}...`);

    https.get(url, (response) => {
        response.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded ${file}`);
        });
    }).on('error', (err) => {
        fs.unlink(dest, () => { }); // Delete the file async. (But we don't check result)
        console.error(`Error downloading ${file}: ${err.message}`);
    });
};

files.forEach(downloadFile);
