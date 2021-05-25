// Angular
import { Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'kt-auth',
	templateUrl: './auth.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
	today: number = Date.now();

	constructor(
		private el: ElementRef,
		private render: Renderer2,) {
	}

	ngOnInit(): void {

	}

}
