import { ExceptionType, Exception } from '../Exception';

export class ModelException extends Exception {
    public constructor(message: string) {
        super(ExceptionType.ModelError, message)
    }
}
