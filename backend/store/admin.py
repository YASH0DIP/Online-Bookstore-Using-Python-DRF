from django.contrib import admin
from .models import Book, User, Review, Order, OrderItem
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'isbn', 'stock', 'rating',)
    list_filter = ('author','rating','stock',)
    search_fields = ('title', 'author', 'isbn',)
    ordering = ('price','rating','stock',)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("id","email", "name", "mobile", "is_staff")
    ordering = ("id",)
    search_fields = ("email", "name", "mobile")
    list_filter = ("is_staff", "is_superuser")

    #for updating user form
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("name", "mobile")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    #for add user form
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "mobile", "password1", "password2"),
        }),
    )

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "book", "created_at","review_data")
    search_fields = ("user__email", "book__title", "review_data")
    list_filter = ("created_at",)
    raw_id_fields = ("user", "book")

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 #no rows by default
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_price", "address", "created_at", 'status',)
    search_fields = ("user__email", "address")
    list_filter = ("created_at",)
    list_editable = ('status',)
    raw_id_fields = ("user",)
    #when adding order from admin panel
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "book", "quantity",)
    list_filter = ('quantity',)
    search_fields = ("book",)
    raw_id_fields = ("order", "book")
