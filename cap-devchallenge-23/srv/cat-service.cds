using {golf} from '../db/schema';
using {RemoteService as external} from './external/RemoteService';

service CatalogService @(path: '/browse') {
  entity Players as projection on external.Players;
  entity Rounds  as projection on golf.Rounds;
  entity Holes   as projection on golf.Rounds.holes;
  entity Shots   as projection on golf.Rounds.holes.shots;
}
