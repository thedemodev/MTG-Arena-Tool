import LogEntry from "../../types/logDecoder";
import { setData } from "../backgroundUtil";
import { playerDb } from "../../shared/db/LocalDatabase";
import { PlayerCourse } from "../../types/event";
import addCustomDeck from "../addCustomDeck";
import Deck from "../../shared/deck";

interface Entry extends LogEntry {
  json: () => PlayerCourse[];
}

export default function InEventGetPlayerCoursesV2(entry: Entry): void {
  const json = entry.json();
  if (!json) return;

  const staticEvents: string[] = [];
  json.forEach(course => {
    if (course.CurrentEventState != "PreMatch") {
      if (course.CourseDeck != null) {
        addCustomDeck(new Deck(course.CourseDeck).getSave());
      }
    }
    if (course.Id) staticEvents.push(course.Id);
  });

  setData({ staticEvents });
  playerDb.upsert("", "static_events", staticEvents);
}
