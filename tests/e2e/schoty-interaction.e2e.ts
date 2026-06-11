import { expect, type Locator, test } from '@playwright/test';

const dragBead = async (bead: Locator, deltaX: number) => {
  const box = await bead.boundingBox();
  expect(box).not.toBeNull();

  if (!box) {
    throw new Error('Bead bounding box was not available.');
  }

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await bead.page().mouse.move(startX, startY);
  await bead.page().mouse.down();
  await bead.page().mouse.move(startX + deltaX, startY, { steps: 4 });
  await bead.page().mouse.up();
};

test('dragging beads updates the live value and reset restores zero', async ({
  page,
}) => {
  await page.goto('/');

  const currentValue = page.getByTestId('current-value');
  const activeBeadCount = page.getByTestId('active-bead-count');
  const onesWire = page.getByTestId('wire-0');
  const tensWire = page.getByTestId('wire-1');

  await expect(currentValue).toHaveText('0');
  await expect(activeBeadCount).toHaveText('0 active beads');

  await dragBead(onesWire.getByRole('button', { name: 'Bead 8 parked' }), 32);
  await expect(currentValue).toHaveText('3');
  await expect(activeBeadCount).toHaveText('3 active beads');

  await dragBead(tensWire.getByRole('button', { name: 'Bead 9 parked' }), 32);
  await expect(currentValue).toHaveText('23');
  await expect(activeBeadCount).toHaveText('5 active beads');

  await dragBead(onesWire.getByRole('button', { name: 'Bead 9 active' }), -32);
  await expect(currentValue).toHaveText('21');
  await expect(activeBeadCount).toHaveText('3 active beads');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(currentValue).toHaveText('0');
  await expect(activeBeadCount).toHaveText('0 active beads');
});
