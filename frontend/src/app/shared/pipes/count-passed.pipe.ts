import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countPassed', standalone: true })
export class CountPassedPipe implements PipeTransform {
  transform(items: any[], passed: boolean): number {
    if (!items) return 0;
    return items.filter((item) => item.passed === passed).length;
  }
}
