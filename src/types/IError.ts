interface IError {
    message: string;
    name: string;
    stack?: string;
    statusCode: number;
    data: any;

}

