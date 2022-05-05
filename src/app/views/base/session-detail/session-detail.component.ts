import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from 'src/app/shared/models/session.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { MatTableDataSource } from '@angular/material/table';
import { Participant } from 'src/app/shared/models/participant.model';
import { TableUtil } from '../tableUtil';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit {
  session: Session;
  dataSource: MatTableDataSource<Participant>;
  displayedColumns: string[] = ['id', 'nom', 'organisme', 'pays', 'prenom', 'profil', 'tel'];


  constructor(private route: ActivatedRoute,
    private sessionservice: SessionService    ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.sessionservice.getSessionById(params.id).subscribe((res)=>{
          this.session = res;
          this.dataSource = new MatTableDataSource(this.session.participants);

          console.log(this.session);
        });
  });
}

exportTable() {
  TableUtil.exportTableToExcel("ExampleMaterialTable");
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

}
