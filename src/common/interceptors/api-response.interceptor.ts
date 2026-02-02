import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Messages } from "../utils/http-messages";

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        return next.handle().pipe(
            map((result) => {

                const ctx = context.switchToHttp();
                const response = ctx.getResponse();
                const statusCode = response.statusCode;

                const { data, operation } = result || {};

                let message = 'Request processed';

                if (operation && Messages[operation]) {
                    message = Messages[operation];
                } else {

                    switch (statusCode) {
                        case 200:
                            message = Messages.PRODUCT_CREATED;
                            break;
                        case 201:
                            message = Messages.CUSTOMER_CREATED;
                            break;
                        case 204:
                            message = Messages.PRODUCT_DELETED;
                            break;
                        case 404:
                            message = Messages.PRODUCT_NOT_FOUND;
                            break;
                    }

                }

                return {
                    statusCode,
                    message,
                    data: data ?? result,
                    timestamp: new Date(),
                };
            })
        )
    }

}