export const authorization = (...roles) => {
    return (req, res, next) => {
   
        if (!req.user) {
            return res.status(401).send({ status: "error", message: "No estás autenticado" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ status: "error", message: "No tenés permisos suficientes" });
        }

        next();
    };
};
