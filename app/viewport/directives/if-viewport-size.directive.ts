import { Directive, TemplateRef, OnInit, AfterViewInit, Input, ViewContainerRef, HostListener, Inject, OnDestroy } from '@angular/core';
import { TestComponent } from '../test.component';
import { CheckViewportService } from '../services/check-viewport.service';
import { CONFIG, IConfig } from '../iterfaces/i-config';
import { fromEvent, Subject  } from 'rxjs';
import { takeUntil, map, filter, debounceTime, distinctUntilChanged, tap, last, skipWhile } from 'rxjs/operators';

type Size = 'small' | 'medium' | 'large';
enum TemplateState {
  CLEARED,
  CREATED,
}

@Directive({
  selector: '[ifViewportSize]'
})
export class IfViewportSizeDirective implements OnInit, OnDestroy {
  private prevWidth: number;
  private width: number;
  private config: IConfig;
  private ngOnDestroy$: Subject<void> = new Subject()
  private state: TemplateState;

  @Input() ifViewportSize: Size;

  constructor(
    @Inject(CONFIG) CONFIG,
    private tpl: TemplateRef<TestComponent>,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.config = CONFIG;
  }

  ngOnInit() {
    fromEvent(window, 'resize').pipe(
      map((ev: Event) => ev && ev.currentTarget && (ev.currentTarget as any).innerWidth),
      filter(Boolean),
      skipWhile((width: number) => this.currAndPrevWidthInSameRange(width, this.prevWidth)),
      takeUntil(this.ngOnDestroy$),
    ).subscribe((width: number) => {
      const widthInRange: boolean = this.isInLimits(width, this.ifViewportSize);
      [this.width, this.prevWidth] = [width, this.width];
      this.showHideTpl(widthInRange);
    })

    this.showHideTpl(this.isInLimits(window.innerWidth, this.ifViewportSize));
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  showHideTpl(inRange: boolean): void {
    if (inRange && this.state !== TemplateState.CREATED) {
      this.state = TemplateState.CREATED;
      this.viewContainerRef.createEmbeddedView(this.tpl);
    } else if (!inRange && this.state !== TemplateState.CLEARED) {
      this.state = TemplateState.CLEARED;
      this.viewContainerRef.clear();
    }
  }

  isInLimits(width: number, size: Size): boolean {
    switch(size) {
      case 'small': {
        return width < this.config.medium;
      }
      case 'medium': {
        return (this.config.medium <= width) && (width < this.config.large);
      }
      case 'large': {
        return this.config.large <= width;
      }
      default:
        return false;
    }
  }

  currAndPrevWidthInSameRange(width: number, prev: number): boolean {
    if (!this.prevWidth) {
      this.prevWidth = this.width = width;
      
      return true;
    }

    const prevWidthInRange: boolean = this.isInLimits(prev, this.ifViewportSize);
    const currWidthInRange: boolean = this.isInLimits(width, this.ifViewportSize);

    return prevWidthInRange === currWidthInRange;
  }
}