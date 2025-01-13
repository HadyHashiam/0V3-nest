import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // console.log('-Before route handler');
    return next.handle().pipe(
      map((ResponseData) => {
        let { data } = ResponseData;
        if (Array.isArray(data)) {
          console.log('data is not object');
          const cleanedData = data.map((user) => {
            const { password, ...userWithoutPassword } = user._doc;
            return userWithoutPassword;
          });
          // Return the modified response
          return { ...ResponseData, data: cleanedData };
        } else if (typeof data === 'object') {
          let { data } = ResponseData;
          // console.log('the data is object : ', data);
          const { password, ...dataWithoutPassword } = data._doc || data;
          return { ...ResponseData, data: dataWithoutPassword };
        }
        return ResponseData;
      }),
    );
  }
}
