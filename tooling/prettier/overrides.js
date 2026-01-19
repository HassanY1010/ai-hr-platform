module.exports = [
    {
        files: '*.json',
        options: {
            parser: 'json',
        },
    },
    {
        files: ['*.md', '*.mdx'],
        options: {
            proseWrap: 'always',
        },
    },
];
