import React from "react";
import { render, screen } from "msa2-ui/src/utils/test-utils";

import StatusBadgeIcon, { ICONS } from "./StatusBadgeIcon";

describe("StatusBadgeIcon", () => {
  it("renders with minimum props", () => {
    render(<StatusBadgeIcon icon={ICONS.deployment} />);
  });

  it("renders passed element", () => {
    const TEST_ICON = "Test Icon";
    const TestIcon = () => <div>{TEST_ICON}</div>;
    render(<StatusBadgeIcon status={"OK"} size={"large"} icon={TestIcon} />);
    const text = screen.getByText(TEST_ICON);
    expect(text).toBeDefined();
  });
});
