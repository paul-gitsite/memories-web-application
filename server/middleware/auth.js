import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isAuth = token.length < 500
        let decodedData;
        if (token && isAuth) {
            decodedData = jwt.verify(token, 'test')
            req.userId = decodedData?.id
        }
        next()

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default auth