interface Link {
  source: number;
  target: number;
  weight?: number;
  color?: string;
  name?: string;
  dashed?: boolean;
}

type NodeType<T> = {
  id: number;
  name: string;
  color: string;
  neighbors: Array<T>;
  links: Array<Link>;
  x: number;
  y: number;
};
interface Node extends NodeType<Node> {}



export type { Link, Node };
