import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { PlaceLocation } from '../modules/pages/hotel-search/hotel-search.component';


export function ValidatePlace(place: PlaceLocation): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if ((control.value !== undefined && control.value === place.placeName)
      && place.lat && place.lng
      && place.lat !== undefined && place.lng !== undefined) {
      return null;
    }
    return { validPlace: true };
  };
}

export function checkDateIsValid(controlName: string, checkControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const checkControl = formGroup.controls[checkControlName];

    const startDate = new Date(control.value);
    const endDate = new Date(checkControl.value);

    if (checkControl.errors && !checkControl.errors.isValidDate) {
      return;
    }

    if (startDate > endDate) {
      checkControl.setErrors({ isValidDate: false });
    } else {
      checkControl.setErrors(null);
    }
  };
}
