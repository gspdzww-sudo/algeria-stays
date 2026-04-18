-- السماح لمالك العقار بتحديث حالة الحجوزات الخاصة بعقاراته
-- (تأكيد، رفض، إكمال) — مع منع تغيير السعر والمستخدم عبر تريغر موجود مسبقاً

CREATE POLICY "Property owners can update bookings status"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = bookings.property_id
      AND properties.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = bookings.property_id
      AND properties.owner_id = auth.uid()
  )
  AND status IN ('pending', 'confirmed', 'cancelled', 'completed', 'rejected')
);