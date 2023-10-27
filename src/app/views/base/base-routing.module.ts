import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsComponent } from './cards.component';
import { FormsComponent } from './forms.component';
import { SwitchesComponent } from './switches.component';
import { TablesComponent } from './tables.component';
import { TabsComponent } from './tabs.component';
import { CarouselsComponent } from './carousels.component';
import { CollapsesComponent } from './collapses.component';
import { PaginationsComponent } from './paginations.component';
import { PopoversComponent } from './popovers.component';
import { ProgressComponent } from './progress.component';
import { TooltipsComponent } from './tooltips.component';
import { NavbarsComponent } from './navbars/navbars.component';
import { UserComponent } from './user/user.component';
import { DomaineComponent } from './domaine/domaine.component';
import { PaysComponent } from './pays/pays.component';
import { ProfilComponent } from './profil/profil.component';
import { OrganismeComponent } from './organisme/organisme.component';
import { FormationComponent } from './formation/formation.component';
import { FormateurComponent } from './formateur/formateur.component';
import { ParticipantComponent } from './participant/participant.component';
import { RoleGuard } from 'src/app/shared/services/role.guard';
import { TestComponent } from './test/test.component';
import { UserGuard } from '../../shared/services/user.guard'
import { SessionComponent } from './session/session.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base'
    },
    children: [
      {
        path: 'users',
        component: UserComponent,
        canActivate: [RoleGuard],
        data: {
          title: 'Users'
        }
      },
      {
        path: 'domaines',
        component: DomaineComponent,
        canActivate: [RoleGuard],
        data: {
          title: 'Domaines'
        }
      },
      {
        path: 'pays',
        component: PaysComponent,
        canActivate: [RoleGuard],
        data: {
          title: 'Pays'
        }
      },
      {
        path: 'profils',
        component: ProfilComponent,
        canActivate: [RoleGuard],
        data: {
          title: 'Profils'
        }
      },
      {
        path: 'organismes',
        component: OrganismeComponent,
        canActivate: [RoleGuard],
        data: {
          title: 'Organismes'
        }
      },
      {
        path: 'formations',
        component: FormationComponent,
        canActivate: [UserGuard],
        data: {
          title: 'Formations'
        }
      },
      {
        path: 'formateurs',
        component: FormateurComponent,
        canActivate: [UserGuard],
        data: {
          title: 'Formateurs'
        }
      },
      {
        path: 'participants',
        component: ParticipantComponent,
        canActivate: [UserGuard],
        data: {
          title: 'Participants'
        }
      },
      {
        path: 'sessions',
        component: SessionComponent,
        canActivate: [UserGuard],

        data: {
          title: 'Sessions'
        }
      },
      {
        path: 'sessions/detail/:id',
        component: SessionDetailComponent,
        canActivate: [UserGuard],

        data: {
          title: 'Sessions'
        }
      },
      {
        path: 'test',
        component: TestComponent,
        data: {
          title: 'Test'
        }
      },
      {
        path: 'tabs',
        component: TabsComponent,
        data: {
          title: 'Tabs'
        }
      },
      {
        path: 'carousels',
        component: CarouselsComponent,
        data: {
          title: 'Carousels'
        }
      },
      {
        path: 'collapses',
        component: CollapsesComponent,
        data: {
          title: 'Collapses'
        }
      },
      {
        path: 'paginations',
        component: PaginationsComponent,
        data: {
          title: 'Pagination'
        }
      },
      {
        path: 'popovers',
        component: PopoversComponent,
        data: {
          title: 'Popover'
        }
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: {
          title: 'Progress'
        }
      },
      {
        path: 'tooltips',
        component: TooltipsComponent,
        data: {
          title: 'Tooltips'
        }
      },
      {
        path: 'navbars',
        component: NavbarsComponent,
        data: {
          title: 'Navbars'
        }
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
