declare module "topojson-client" {
  import { FeatureCollection } from "geojson";
  import { Topology, GeometryObject } from "topojson-specification";

  export function feature(
    topology: Topology,
    object: GeometryObject | string
  ): FeatureCollection;
}
