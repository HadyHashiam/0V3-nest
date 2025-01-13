import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('-Before route handler');

    // return next.handle().pipe(tap(() => console.log('-After route handler')));

    // return next.handle().pipe(
    //   map((ResponseData) => {
    //     let { data } = ResponseData;
    //     if (!data) {
    //       const { password, ...otherData } = ResponseData;
    //       console.log('case 2');
    //       return otherData;
    //     } else {
    //       const array = data.map((responseData) => {
    //         const { password, ...otherData } = responseData; // to
    //         console.log('otherData 1: ', otherData);
    //         console.log('password 1: ', password);
    //         console.log('responseData 1: ', responseData);
    //         console.log('case 11111111111');

    //         // not
    //         return { otherData };

    //       });

    //     }

    //     // new array with out password
    //     const { password, ...otherData } = data; // to not
    //     console.log('case 2222222222222');
    //     return otherData;
    //   }),
    // );
    return next.handle().pipe(
      map((ResponseData) => {
        let { data } = ResponseData;
        if (data) {
          const { password, ...otherData } = data;
          console.log('The ResponseData.data:', ResponseData.data);
          let array = [];
          array.push(ResponseData.data);
          console.log('The array:', array);
          console.log('The data:', data);

          console.log('case 1');
          // console.log('The data Destructing from res:', data);

          return otherData;
        }
        const { password, ...otherData } = ResponseData; // to not include the password in the response to the client
        console.log('case 2');
        return otherData;
      }),
    );
  }
}
