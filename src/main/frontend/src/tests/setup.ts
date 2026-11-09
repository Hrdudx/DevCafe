import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Desmonta o que cada teste desenhou, para um teste não interferir no outro.
afterEach(() => {
    cleanup();
});
