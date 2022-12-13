interface Link {
  source: number;
  target: number;
  weight?: number;
  color?: string;
}

type NodeType<T> = {
  id: number;
  name: string;
  color: string;
  neighbors: Array<T>;
  links: Array<Link>;
};
interface Node extends NodeType<Node> {}



export type { Link, Node };
