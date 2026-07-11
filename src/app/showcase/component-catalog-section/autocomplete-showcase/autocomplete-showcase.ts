import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormField, form, required } from '@angular/forms/signals';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { UiAutocomplete } from '../../../components/ui-autocomplete/ui-autocomplete';
import { UiAutocompleteOption } from '../../../components/ui-autocomplete/ui-autocomplete-option/ui-autocomplete-option';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

interface PlaceholderUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface PlaceholderUsersResponse {
  users: PlaceholderUser[];
  total: number;
  skip: number;
  limit: number;
}

interface UserSearchState {
  users: PlaceholderUser[];
  loading: boolean;
  failed: boolean;
}

const USERS_SEARCH_URL = 'https://dummyjson.com/users/search';
const EMPTY_USERS_RESPONSE: PlaceholderUsersResponse = { users: [], total: 0, skip: 0, limit: 0 };
const EMPTY_SEARCH_STATE: UserSearchState = { users: [], loading: false, failed: false };

@Component({
  selector: 'app-autocomplete-showcase',
  imports: [FormField, UiAutocomplete, UiAutocompleteOption, UiButton, UiCard, UiTab, UiTabItem],
  templateUrl: './autocomplete-showcase.html',
  styleUrl: './autocomplete-showcase.css',
})
export class AutocompleteShowcase {
  private readonly http = inject(HttpClient);

  protected readonly teams = ['Platform', 'Growth', 'Support', 'Finance', 'Legal'];
  protected readonly teamQuery = signal('');
  protected readonly filteredTeams = computed(() => {
    const query = this.teamQuery().trim().toLocaleLowerCase();
    return this.teams.filter((team) => team.toLocaleLowerCase().includes(query));
  });
  protected readonly selectedTeam = signal('team_support');
  protected readonly resourceQuery = signal('');
  protected readonly resourceSearch = httpResource<PlaceholderUsersResponse>(() => {
    const query = this.resourceQuery().trim();
    return query.length >= 2
      ? { url: USERS_SEARCH_URL, params: { q: query, limit: 8, select: 'id,firstName,lastName,email' } }
      : undefined;
  }, { defaultValue: EMPTY_USERS_RESPONSE });
  protected readonly resourceUsers = computed(() =>
    this.resourceSearch.hasValue() ? this.resourceSearch.value().users : [],
  );
  protected readonly resourceEmptyText = computed(() =>
    this.resourceQuery().trim().length < 2 ? 'Type at least 2 characters' : 'No users found',
  );

  protected readonly rxQuery = signal('');
  protected readonly rxSearch = toSignal(
    toObservable(this.rxQuery).pipe(
      map((query) => query.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        query.length >= 2 ? this.searchUsers(query) : of(EMPTY_SEARCH_STATE),
      ),
    ),
    { initialValue: EMPTY_SEARCH_STATE },
  );
  protected readonly rxEmptyText = computed(() =>
    this.rxQuery().trim().length < 2 ? 'Type at least 2 characters' : 'No users found',
  );
  protected readonly formModel = signal({ team: '' });
  protected readonly formState = form(this.formModel, (path) => {
    required(path.team, { message: 'Choose a team' });
  });
  protected readonly defaultCode = `readonly query = signal('');
readonly results = computed(() =>
  teams.filter(team => team.toLowerCase().includes(query().toLowerCase())),
);

<ui-autocomplete label="Team" [(query)]="query">
  @for (team of results(); track team) {
    <ui-autocomplete-option [value]="team" [label]="team" />
  }
</ui-autocomplete>`;
  protected readonly resourceCode = `readonly query = signal('');
readonly users = httpResource<UsersResponse>(() => {
  const q = query().trim();
  return q.length >= 2
    ? {url: 'https://dummyjson.com/users/search', params: {q, limit: 8}}
    : undefined;
}, {defaultValue: {users: [], total: 0, skip: 0, limit: 0}});
readonly results = computed(() => users.hasValue() ? users.value().users : []);

<ui-autocomplete [(query)]="query" [loading]="users.isLoading()">
  @for (user of results(); track user.id) {
    <ui-autocomplete-option [value]="user.id.toString()" [label]="user.firstName" />
  }
</ui-autocomplete>`;
  protected readonly rxCode = `readonly query = signal('');
readonly search = toSignal(toObservable(query).pipe(
  map(q => q.trim()),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(q => q.length < 2 ? of([]) :
    http.get<UsersResponse>('https://dummyjson.com/users/search', {params: {q}}).pipe(
      map(response => response.users),
      catchError(() => of([])),
    ),
  ),
), {initialValue: []});`;
  protected readonly valueCode = `readonly team = signal('team_support');\n\n<ui-autocomplete label="Team" [(value)]="team">...</ui-autocomplete>`;
  protected readonly stateCode = `<ui-autocomplete label="Small" size="sm">...</ui-autocomplete>\n<ui-autocomplete label="Loading" loading />\n<ui-autocomplete label="Disabled" disabled>...</ui-autocomplete>`;
  protected readonly copyCode = `<ui-autocomplete label="Owner" placeholder="Search people" emptyText="No people found" loadingText="Loading people" loading>...</ui-autocomplete>`;
  protected readonly formCode = `readonly state = form(model, path => required(path.team, {message: 'Choose a team'}));\n\n<ui-autocomplete label="Team" withErrorMessage [formField]="state.team">...</ui-autocomplete>`;

  protected userLabel(user: PlaceholderUser): string {
    return `${user.firstName} ${user.lastName} — ${user.email}`;
  }

  private searchUsers(query: string) {
    return this.http
      .get<PlaceholderUsersResponse>(USERS_SEARCH_URL, {
        params: { q: query, limit: 8, select: 'id,firstName,lastName,email' },
      })
      .pipe(
        map((response): UserSearchState => ({ users: response.users, loading: false, failed: false })),
        startWith<UserSearchState>({ users: [], loading: true, failed: false }),
        catchError(() => of<UserSearchState>({ users: [], loading: false, failed: true })),
      );
  }
}
