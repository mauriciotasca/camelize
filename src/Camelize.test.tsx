import React from "react";
import { render, screen } from "@testing-library/react";
import Camelize from "./Camelize";

test("renders learn react link", () => {
  render(<Camelize />);
  const linkElement = screen.getByText(/camelize/i);
  expect(linkElement).toBeInTheDocument();
});
