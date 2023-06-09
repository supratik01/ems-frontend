import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Employee } from '../shared/employee.model';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2'
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private ngxLoader: NgxUiLoaderService,
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  employeeList: Employee[] = [];

  displayedColumns: string[] = ["No", "Profile", "Name", "Email", "DOB", "Country", "Actions"];
  dataSource: any;

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.ngxLoader.start();
    this.apiService.getEmployeesList().subscribe((rslt: any) => {
      this.ngxLoader.stop();
      this.employeeList = rslt?.empList as Employee[];
      this.employeeList = this.employeeList.map(emp => {
        if(emp.avatar) {
          emp.avatar = `${environment.apiUrl}${emp.avatar}`
        }
        return emp;
      })

      this.dataSource = new MatTableDataSource<Employee>(this.employeeList);
      this.dataSource.paginator = this.paginator;
    })
  }

  deleteServiceAlert(empId: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      position: 'center',
      customClass: {
        confirmButton: 'btn btn-success me-2',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        position: 'center',
        title: 'Are you sure, you want to delete this?',
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          this.apiService.deleteEmployee(empId)
            .subscribe((arg: any) => {
              swalWithBootstrapButtons.fire("Deleted!", arg.msg, "success");
              this.fetchEmployees();
          });
        }
      });
  }
}
