import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  submitted = false;
  loading = false;
  empForm!: FormGroup;
  maxDate: Date;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
  ) {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - 15, 11, 31);
  }

  ngOnInit(): void {
    this.empForm = this.formBuilder.group({
      first_name: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40)
      ])),
      last_name: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40)
      ])),
      country: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      dob: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      avatar: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    });
  }

  get f() {
    return this.empForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (imag) => { // called once readAsDataURL is completed
        this.empForm.get('avatar')?.setValue(event?.target?.files[0]);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.empForm.invalid) {
      return;
    }
    this.loading = true;
    this.ngxLoader.start();

    const formData = new FormData();

    formData.append('fname', this.f['first_name'].value);
    formData.append('lname', this.f['last_name'].value);
    formData.append('email', this.f['email'].value);
    formData.append('country', this.f['country'].value);
    formData.append('dob', this.f['dob'].value);
    formData.append('avatar', this.f['avatar'].value);

    this.apiService.createEmployee(formData)
      .subscribe((res: any) => {
        this.loading = false;
        this.submitted = false;
        this.ngxLoader.stop();
        this.toastr.success(res?.msg);
        this.router.navigate(['/home']);
    });
  }
}
