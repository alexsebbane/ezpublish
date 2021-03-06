{def $wish_list = fetch( 'shop', 'current_wish_list' )
     $wish_list_count = fetch( 'shop', 'wish_list_count', hash( 'production_id', $wish_list.productcollection_id ) )}

{cache-block keys=array( $user.contentobject_id, $wish_list_count ) ignore_content_expiry}

<h2>{'Wish list'|i18n( 'design/admin/dashboard/wishlist' )}</h2>

{if $wish_list_count}

<table class="list" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <th>{'Name'|i18n( 'design/admin/dashboard/wishlist' )}</th>
        <th>{'Type'|i18n( 'design/admin/dashboard/wishlist' )}</th>
    </tr>
    {foreach fetch( 'shop', 'wish_list', hash( 'production_id', $wish_list.productcollection_id,
                                               'limit', $block.number_of_items ) ) as $wish_list_item sequence array( 'bglight', 'bgdark' ) as $style}
        <tr class="{$style}">
            <td>
                <a href="{$wish_list_item.item_object.contentobject.main_node.url_alias|ezurl('no')}" title="{$wish_list_item.object_name|wash()}">
                    {$wish_list_item.object_name|wash()}
                </a>
            </td>
            <td>
                {$wish_list_item.item_object.contentobject.class_name|wash()}                
            </td>
        </tr>
    {/foreach}
</table>

{else}

<p>{'Currently you do not have any products on your wish list.'|i18n( 'design/admin/dashboard/wishlist' )}</p>

{/if}

{/cache-block}

{undef $wish_list $wish_list_count}