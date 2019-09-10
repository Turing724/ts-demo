export interface LoginProps {

}

export interface LoginState {
  navList: navList[]
}
export interface navList {
  name: string,
  id: number,
  path: string
}