import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'values', pure: false})
export class ValuesPipe implements PipeTransform {
    transform(value: any, args?: any[]): any[] {
        let keyArr: any[] = Object.keys(value),
            dataArr = [],
            keyName = args[0];

        keyArr.forEach((key: any) => {
            value[key][keyName] = key;
            dataArr.push(value[key])
        });

        if(args[1]) {
            dataArr.sort((a: Object, b: Object): number => {
                return a[keyName] > b[keyName] ? 1 : -1;
            });
        }

        return dataArr;
    }
}