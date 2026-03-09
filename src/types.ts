
export type Role = 'Advogado' | 'Revisor' | 'Suporte';
export type RACIType = 'R' | 'A' | 'C' | 'I';

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  raci: RACIType;
}

export interface Municipality {
  id: number;
  name: string;
}

export interface Region {
  id: string;
  name: string;
  team: TeamMember[];
  municipalities: Municipality[];
}
