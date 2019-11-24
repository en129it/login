import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'app-pin-form',
    templateUrl: './pinform.component.html',
    styleUrls: ['./pinForm.component.scss']
})
export class PinFormComponent implements OnInit {
    form: FormGroup;

    private static containsPattern(arr: Array<number>): boolean {
        for (let i = 1; i < arr.length; i++) {
            const val1 = arr[i - 1];
            const val2 = arr[i];

            for (let j = i; j < arr.length - 1; j++) {
                if (arr[j] === val1 && arr[j + 1] === val2) {
                    return true;
                }
            }
        }
        return false;
    }

    private static sequenceValidator(): ValidatorFn {
        return (control: FormControl): ValidationErrors | null => {
            const val: string = '' + control.value;
            const valArr = new Array<number>();
            const diffArr = new Array<number>();

            if (val.length > 1) {
                valArr[0] = Number.parseInt(val.substr(0, 1), 10);
                for (let i = 1; i < val.length; i++) {
                    valArr[i] = Number.parseInt(val.substr(i, 1), 10);
                    diffArr[i - 1] = valArr[i] - valArr[i - 1];
                }
            }

            return (this.containsPattern(valArr) || this.containsPattern(diffArr)) ? { pattern : true} : null;
        };
    }

    public ngOnInit() {
        this.form = new FormGroup({
            pin : new FormControl('', PinFormComponent.sequenceValidator())
        });
    }

    public onSubmit() {
        console.log('### onSumit');
    }
}
