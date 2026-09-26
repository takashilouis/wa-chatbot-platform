import { ProtectedWorkspace } from '../../components/protected-workspace';
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedWorkspace>{children}</ProtectedWorkspace>;
}
