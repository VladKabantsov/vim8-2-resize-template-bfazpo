import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfViewportSizeDirective } from './directives/if-viewport-size.directive';
import { environment } from '../environments/environment';
import { CONFIG, IConfig } from './iterfaces/i-config';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IfViewportSizeDirective],
  exports: [IfViewportSizeDirective],
})
export class ViewportModule {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: ViewportModule,
      providers: [{ provide: CONFIG, useValue: config }]
    };
  }
}