/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';

import { UsuariosProvider } from "../../database/providers/usuarios";
import { validation } from "../../shared/middleware";
import { IUsuario } from "../../database/models";

interface IBodyProps extends Omit<IUsuario, "id" | "nome"> {}

export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().email().min(5),
        senha: yup.string().required().min(12),
    })),
}));

export const signIn = async (req: Request<{},{},IBodyProps>, res: Response) => {

    const {email, senha} = req.body;


    const result = await UsuariosProvider.getByEmail(email);

    if (result instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors:{
                default: 'E-mail ou senha inválidos',
            }
        });
    }

    if (senha !== result.senha) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors:{
                default: 'E-mail ou senha inválidos',
            }
        });
    } else {
        return res.status(StatusCodes.OK).json({accessToken: 'teste.teste.teste'});
    }

    // return res.status(StatusCodes.CREATED).json(result);
};
