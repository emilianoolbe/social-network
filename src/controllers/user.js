// --> Modelo + validaciones<--
const User = require('../database/models/User');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
// --> Métodos <--

//Todos los usuarios
const allUsers = (req, res) => {
    res.status(200).json({
        status: 'Success',
        message: 'Controlador user'
    });
};

//Usuario por ID
const userById = (req, res) => {

};

//Crear usuario
const createUser = async (req, res) => {

    //validación de datos
    let errors = validationResult(req);

    if (errors.isEmpty()) {

        //Control de usuarios duplicados
        let userAllreadyExist = await User.find({
            '$or': [{email: req.body.email}, {nick: req.body.nick}]
        });

        if (userAllreadyExist.length > 0) {
            return res.status(200).json({
                status: 'Error',
                message:'Este email o nick ya estan registrados'
            });
        };
        // --> No hay datos ingresados duplicados <--

        //Cifrado de datos sensibles
        let pwd= await bcrypt.hash(req.body.password, 10);
        req.body.password = pwd;

        //Creo objeto a guardar
        const userToSave = new User(req.body)
    
        //Guardar usuario en DB - retorno de resultados
        let userStored = await userToSave.save();
        userToSave.save()
            .then((userStored) => {
                return res.status(200).json({
                    status: 'Success',
                    message: 'Usuario registrado correctamente',
                    user: userStored
                });
            }).catch((err) => {
                return res.status(500).json({
                    status: 'Erros',
                    message: 'Error al guardar usuario en DB'
                });
            });         
    
    }else{
        //Muestro errores de validación
        return res.status(400).json({
            status: 'Se han encontrado errores en la validación de los datos ingresados',
            message: errors.mapped()
        });
    };
    

    
};

//Editar usuario
const editUser = (req, res) => {

};

//Eliminar usuario
const deleteUser = (req, res) => {

};

//Login
const login = async (req, res) => {

    //Validaciones
    let errors = validationResult(req)

    if (errors.isEmpty()) {
        
        //Valido si existe el usuario
        const userToLogin = await User.findOne({email: req.body.email})
        if (!userToLogin) {
            return res.status(400).json({
                status: 'Error',
                message: 'El email que ha ingresado no existe, debe registrarse primero para poder loguearse'
            });
        };
        //Valido contraseña de usuario
        const pwd = bcrypt.compareSync(req.body.password, userToLogin.password)
        if (!pwd){
            return res.status(400).json({
                status: 'Error',
                message: 'Credenciales incorrectas'
            });
        };

        //Conseguir Token
    
        //Devolver resultados
        return res.status(200).json({
            status: 'Success',
            message: 'Usuario logueado correctamente',
            user: {
                id: userToLogin._id,
                name: userToLogin.name,
                nick: userToLogin.nick,     
            }
        });

    }else{
        return res.status(400).json({
            status: 'Error',
            message: errors.mapped()
        });
    };
};

//Logout
const logout = (req, res) => {

};

module.exports = {allUsers, userById, createUser, editUser, deleteUser, login, logout};

