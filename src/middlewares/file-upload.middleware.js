import multer from 'multer'

const storageConfiguration = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb){
        const name = Date.now() + "-" + file.originalname;
        cb(null, name);
    }
});

export const uploadFile = multer({storage: storageConfiguration});