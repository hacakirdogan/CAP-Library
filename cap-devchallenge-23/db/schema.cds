using {
  managed,
  sap,
  cuid
} from '@sap/cds/common';

namespace golf;

entity Rounds : cuid, managed {
  title : String;
  holes : Composition of many Holes;
}

aspect Holes : cuid {
  par   : Integer @assert.range: [3,5];
  score : Integer;
  shots : Composition of many Shots;
  result: String;
}

aspect Shots : cuid {
  distance : Integer;
}
