import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countBy', standalone: true })
export class CountByPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): number {
    if (!items) return 0;
    return items.filter((item) => item[field] === value).length;
  }
}
