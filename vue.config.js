module.exports = {
    publicPath:
        process.env.NODE_ENV === 'production' ? '/webapps/loadtester/' : '/',

    filenameHashing: false,

    pluginOptions: {
        s3Deploy: {
            registry: undefined,
            awsProfile: '',
            region: '',
            bucket: '',
            createBucket: false,
            staticHosting: false,
            assetPath: 'dist',
            assetMatch: '**',
            deployPath: '',
            acl: 'private',
            pwa: false,
            enableCloudfront: false,
            cloudfrontId: '',
            cloudfrontMatchers: '',
            uploadConcurrency: 5,
            pluginVersion: '3.0.0',
        },
    },
};
