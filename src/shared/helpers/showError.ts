import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import type { Envelope } from "../api/Envelope";

export function showError(error: unknown) {
    const rtkError = error as FetchBaseQueryError | SerializedError | undefined;
    console.error(rtkError);

    getErrorMessages(rtkError).map(error => {
        toast.error(error);
    });
}

function getErrorMessages(error: FetchBaseQueryError | SerializedError | undefined): string[] {
    if (error) {
        if ("status" in error) {
            const errorData = error.data as Envelope<null> | undefined;

            if (errorData && errorData.responseErrors) {
                return errorData.responseErrors.map(error => {
                    return GetErrorMessage(error.code, error.invalidField);
                });
            }

            return ["Серверная ошибка"];
        }

        return ["Непредвиденная ошибка"];
    }

    return [];
}

const GetErrorMessage = (code: string, field?: string) => {
    const message = ErrorMessages[code];

    if (!message)
        return "Неизвестная ошибка";

    if (message.includes('*'))
        return field !== null && field !== undefined && field.trim().length > 0 ? message.replace("*", field) : message;

    return message;
}

const ErrorMessages: Record<string, string> = {
    "value.is.invalid": "Значение * некорректное",
    "record.not.found": "Объект не найден",
    "failure": "Что - то пошло не так",
    "value.is.required": "Ожидаются значения для *",
    "user.already.exist": "Такой пользователь уже существует",
    "DuplicateEmail": "Пользователь с такой почтой уже существует",
    "DuplicateUserName": "Пользователь с таким именем уже существует",
    "user.not.found": "Пользователь не найден",
    "user.not.verified": "Адрес электронной почты пользователя не подтвержден",
    "user.wrong.credentials": "Неверные пользовательские данные",
    "server.internal": "Ошибка на стороне сервера",
    "send.email.failure": "Не удалось отправить сообщение на электронную почту",
    "user.invalid.balance": "Недостаточно средств для выполнения этого действия",
    "PasswordRequiresUpper": "Некорректный пароль",
    "header.not.found": "Заголовок * не найден",
    "collation.create.failure": "Не удалось сверить документы. Повторите попытку позже"
}